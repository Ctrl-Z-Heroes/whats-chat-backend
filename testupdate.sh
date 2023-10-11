#!/bin/bash

# Define the new image name
new_image="hello"

# Specify the path to your Deployment YAML file
file_path="deployment.yaml"

registry="obarker94"
image="whatsbackend"
concat="$registry/$image"
tag="rc-123"

awk -v image_name="$concat" -v tag="$tag" '{
  if ($0 ~ "image: " image_name) {
    sub("image: " image_name ".*", "image: " image_name ":" tag)
  }
  print $0
}' ./kubernetes/deployment.yaml > temp.yaml && mv temp.yaml ./kubernetes/deployment.yaml
