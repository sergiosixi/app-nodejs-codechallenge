echo 'Creating kafka topics'

BOOTSTRAP_SERVER=${BOOTSTRAP_SERVER:-kafka:29092}
create_topic_if_not_exists() {
  local topic=$1
  echo "Checking topic: $topic"
  kafka-topics --bootstrap-server "$BOOTSTRAP_SERVER" --list | grep -wq "$topic"
  if [ $? -eq 0 ]; then
    echo "The topic '$topic' already exists."
  else
    kafka-topics --bootstrap-server "$BOOTSTRAP_SERVER" \
      --create --topic "$topic" --replication-factor 1 --partitions 1
    echo "Successfully created the topic: $topic"
  fi
}

create_topic_if_not_exists "transaction.created"
create_topic_if_not_exists "transaction.approved"
create_topic_if_not_exists "transaction.rejected"

echo 'Creating schema registry'

SCHEMA_REGISTRY_SERVER=${SCHEMA_REGISTRY_SERVER:-schema-registry:8081}
post_schema() {
  local index=$1
  local subject=$2
  local schema=$(sed -n 's/.*"schema": "\(.*\)".*/\1/p' /app/scripts/schemas.json | sed -n "${index}p")

  curl -s -X POST http://$SCHEMA_REGISTRY_SERVER/subjects/${subject}/versions \
    -H "Content-Type: application/vnd.schemaregistry.v1+json" \
    -d "{\"schema\": \"$schema\"}"
}

post_schema 1 "TransactionCreatedValue"
post_schema 2 "TransactionApprovedValue"
post_schema 3 "TransactionRejectedValue"