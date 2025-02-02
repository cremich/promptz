#!/bin/bash

# This script migrates users from a Cognito User Pool to a DynamoDB table
# Usage: USER_POOL_ID=<user-pool-id> DYNAMODB_TABLE=<table-name> ./migrate-users.sh

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

if [ $# -ne 2 ]; then
    echo "Usage: $0 <table-name> <userpool_id>"
    echo "Example: $0 my-dynamodb-table my-userpool"
    exit 1
fi

DYNAMODB_TABLE="$1"
USER_POOL_ID="$2"

# Get all users from Cognito User Pool
echo "Fetching users from Cognito User Pool..."
TOKEN=""
while true; do
    if [ -z "$TOKEN" ]; then
        USERS=$(aws cognito-idp list-users --user-pool-id "$USER_POOL_ID")
    else
        USERS=$(aws cognito-idp list-users --user-pool-id "$USER_POOL_ID" --pagination-token "$TOKEN")
    fi

    # Extract pagination token for next iteration
    TOKEN=$(echo "$USERS" | jq -r '.PaginationToken // empty')

    # Process each user
    echo "$USERS" | jq -c '.Users[]' | while read -r user; do
        # Extract user attributes
        USERNAME=$(echo "$user" | jq -r '.Username')
        USER_ID=$(echo "$user" | jq -r '.Attributes[] | select(.Name=="sub") | .Value')
        EMAIL=$(echo "$user" | jq -r '.Attributes[] | select(.Name=="email") | .Value')
        DISPLAY_NAME=$(echo "$user" | jq -r '.Attributes[] | select(.Name=="preferred_username") | .Value')
        CREATED_AT=$(echo "$user" | jq -r '.UserCreateDate')
        UPDATED_AT=$(echo "$user" | jq -r '.UserLastModifiedDate')

        echo "Processing user: $USERNAME ($EMAIL)"

        # Create DynamoDB item
        aws dynamodb put-item \
            --table-name "$DYNAMODB_TABLE" \
            --item "{
                \"id\": {\"S\": \"$USER_ID\"},
                \"__typename\": {\"S\": \"user\"},
                \"username\": {\"S\": \"$USERNAME\"},
                \"email\": {\"S\": \"$EMAIL\"},
                \"displayName\": {\"S\": \"$DISPLAY_NAME\"},
                \"owner\": {\"S\": \"$USER_ID::$USERNAME\"},
                \"createdAt\": {\"S\": \"$CREATED_AT\"},
                \"updatedAt\": {\"S\": \"$UPDATED_AT\"}
            }"

        if [ $? -eq 0 ]; then
            echo "Successfully migrated user: $USERNAME"
        else
            echo "Failed to migrate user: $USERNAME"
        fi
    done

    # Break if no more pages
    if [ -z "$TOKEN" ]; then
        break
    fi
done

echo "Migration completed!"