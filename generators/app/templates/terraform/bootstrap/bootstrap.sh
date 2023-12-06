aws s3 mb s3://unc-tf-state \
    --region eu-west-2

aws dynamodb create-table \
    --region eu-west-2 \
    --table-name unc-tf-lock \
    --billing-mode 