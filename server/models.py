from app import mongo

def get_all_components():
    return mongo.db.components.find()

def get_all_component_by_id(component_id):
    return mongo.db.components.find_one({"_id": component_id})