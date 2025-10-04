---
title: "Create EKS Cluster using aws and terraform best practices"
description: "Multi-prompt /dev agent prompt to create a new EKS cluster "
author: "Abhijit Karode"
tags: ["Deploy", "IDE", "Dev Agent"]
---

# Create EKS Cluster using aws and terraform best practices

/dev create a terraform project for creating an EKS cluster. Also create any VPC, subnets and other AWS resources required for this new EKS cluster. Use latest available versions of aws terraform modules. make sure the subnet can auto assign Public IP addresses. set enable_cluster_creator_admin_permissions = true. Use version 20 or higher of terraform-aws-modules/eks/aws and version 1.32 of Kubernetes . Name the EKS cluster “dev_q_eks_cluster”
