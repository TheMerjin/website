import json
from collections import defaultdict

with open("emails.json") as f:
    emails = json.load(f)

by_id = {}
children = defaultdict(list)


def clean_id(x):
    if not x:
        return None
    return x.strip()


# 1. index emails by id
for e in emails:
    msg_id = clean_id(e["message_id"])
    if msg_id:
        by_id[msg_id] = e

# 2. build parent → children map + roots
roots = []

for e in emails:
    msg_id = clean_id(e["message_id"])
    parent = clean_id(e["in_reply_to"])

    if parent and parent in by_id:
        children[parent].append(e)
    else:
        roots.append(e)


# 3. attach children recursively
def attach(node):
    node_id = clean_id(node["message_id"])
    node["children"] = children.get(node_id, [])

    for c in node["children"]:
        attach(c)


for r in roots:
    attach(r)


# 4. prune empty branches
def prune(node):
    node["children"] = [prune(c) for c in node.get("children", [])]
    node["children"] = [c for c in node["children"] if c]
    return node


# 5. compute max depth
def max_depth(node):
    if not node.get("children"):
        return 1
    return 1 + max(max_depth(c) for c in node["children"])


# 6. filter: keep only threads with depth ≥ 3
filtered_roots = []

for r in roots:
    r = prune(r)
    if r and max_depth(r) >= 6:
        filtered_roots.append(r)

# 7. save
with open("threads.json", "w") as f:
    json.dump(filtered_roots, f, indent=2)
