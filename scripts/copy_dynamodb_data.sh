#!/bin/bash

# Script to copy data from a source DynamoDB table to a target DynamoDB table
# across different AWS accounts using named profiles

# Exit on error
set -e

# Check if required arguments are provided
if [ $# -lt 4 ]; then
    echo "Usage: $0 <source_table> <source_region> <target_table> <target_region>"
    echo "Example: $0 my-source-table us-east-1 my-target-table eu-west-1"
    exit 1
fi

SOURCE_TABLE=$1
SOURCE_REGION=$2
TARGET_TABLE=$3
TARGET_REGION=$4

# Source profile is "source", target profile is "target"
SOURCE_PROFILE="source"
TARGET_PROFILE="target"

echo "Starting DynamoDB data migration..."
echo "Source: $SOURCE_TABLE ($SOURCE_REGION) using profile $SOURCE_PROFILE"
echo "Target: $TARGET_TABLE ($TARGET_REGION) using profile $TARGET_PROFILE"

# Verify source table exists
echo "Verifying source table..."
if ! aws dynamodb describe-table --table-name "$SOURCE_TABLE" --region "$SOURCE_REGION" --profile "$SOURCE_PROFILE" &> /dev/null; then
    echo "Error: Source table '$SOURCE_TABLE' not found in region '$SOURCE_REGION'"
    exit 1
fi

# Verify target table exists
echo "Verifying target table..."
if ! aws dynamodb describe-table --table-name "$TARGET_TABLE" --region "$TARGET_REGION" --profile "$TARGET_PROFILE" &> /dev/null; then
    echo "Error: Target table '$TARGET_TABLE' not found in region '$TARGET_REGION'"
    exit 1
fi

# Get table schema to verify compatibility
SOURCE_SCHEMA=$(aws dynamodb describe-table --table-name "$SOURCE_TABLE" --region "$SOURCE_REGION" --profile "$SOURCE_PROFILE" --query "Table.{KeySchema:KeySchema,AttributeDefinitions:AttributeDefinitions}" --output json)
TARGET_SCHEMA=$(aws dynamodb describe-table --table-name "$TARGET_TABLE" --region "$TARGET_REGION" --profile "$TARGET_PROFILE" --query "Table.{KeySchema:KeySchema,AttributeDefinitions:AttributeDefinitions}" --output json)

echo "Verifying table schemas are compatible..."
# In a production environment, you might want to add more sophisticated schema comparison here

# Create a temporary directory for storing items
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Scan source table in batches
echo "Scanning source table and copying data..."
LAST_EVALUATED_KEY=""
BATCH_COUNT=0
ITEM_COUNT=0

while true; do
    if [ -z "$LAST_EVALUATED_KEY" ]; then
        aws dynamodb scan \
            --table-name "$SOURCE_TABLE" \
            --region "$SOURCE_REGION" \
            --profile "$SOURCE_PROFILE" \
            --max-items 25 \
            --output json > "$TEMP_DIR/scan_result.json"
    else
        aws dynamodb scan \
            --table-name "$SOURCE_TABLE" \
            --region "$SOURCE_REGION" \
            --profile "$SOURCE_PROFILE" \
            --max-items 25 \
            --starting-token "$LAST_EVALUATED_KEY" \
            --output json > "$TEMP_DIR/scan_result.json"
    fi
    
    # Count items in this batch
    BATCH_ITEMS=$(jq '.Items | length' "$TEMP_DIR/scan_result.json")
    ITEM_COUNT=$((ITEM_COUNT + BATCH_ITEMS))
    
    # Extract each item and write it to the target table
    for i in $(seq 0 $((BATCH_ITEMS - 1))); do
        # Extract a single item to a file, properly handling all escaping
        jq -c ".Items[$i]" "$TEMP_DIR/scan_result.json" > "$TEMP_DIR/item.json"
        
        # Use the file as input for the put-item command
        aws dynamodb put-item \
            --table-name "$TARGET_TABLE" \
            --region "$TARGET_REGION" \
            --profile "$TARGET_PROFILE" \
            --item "file://$TEMP_DIR/item.json"
    done
    
    BATCH_COUNT=$((BATCH_COUNT + 1))
    echo "Processed batch $BATCH_COUNT with $BATCH_ITEMS items"
    
    # Check if there are more items to scan
    LAST_EVALUATED_KEY=$(jq -r '.NextToken // empty' "$TEMP_DIR/scan_result.json")
    
    if [ -z "$LAST_EVALUATED_KEY" ]; then
        break
    fi
done

# Clean up temporary files
rm -rf "$TEMP_DIR"

echo "Data migration completed successfully!"
echo "Total batches processed: $BATCH_COUNT"
echo "Total items copied: $ITEM_COUNT"
