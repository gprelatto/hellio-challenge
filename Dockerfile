# Use the official MongoDB image
FROM mongo:latest

# Expose the default MongoDB port
EXPOSE 27017

# Start the MongoDB server
CMD ["mongod"]
