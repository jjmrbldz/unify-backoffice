export class DynamicParentIdSorter {
    constructor(data) {
        this.data = data;
        this.parentId = this.data.length > 0 ? this.data[0].tp_parentid : null;
        this.parentMap = new Map();
        this.sortedData = [];
        this.visited = new Set();
    }

    organizeData() {
        this.data.forEach(item => {
        const parentId = item.tp_parentid;
        if (!this.parentMap.has(parentId)) {
            this.parentMap.set(parentId, []);
        }
        this.parentMap.get(parentId).push(item);
        });
    }

    appendChildren(parentId) {
        if (this.parentMap.has(parentId)) {
        const children = this.parentMap.get(parentId);
        children.forEach(child => {
            if (!this.visited.has(child.id)) {
            this.visited.add(child.id);
            this.sortedData.push(child);
            this.appendChildren(child.id);
            }
        });
        }
    }

    sortData() {
        if (this.parentId === null) {
        throw new Error("No parent ID found in the initial data.");
        }
        this.organizeData();
        const topLevelObjects = this.parentMap.get(this.parentId);
        if (topLevelObjects) {
        topLevelObjects.forEach(obj => {
            if (!this.visited.has(obj.id)) {
            this.visited.add(obj.id);
            this.sortedData.push(obj);
            this.appendChildren(obj.id);
            }
        });
        }
        return this.sortedData;
    }
}

export class NestedConverter {
    constructor(initialData) {
        this.initialData = initialData;
        this.nestedData = [];
        this.buildNestedData();
    }

    buildNestedData() {
        const map = {};
        const roots = [];

        // Create a mapping of id to node and find root nodes
        this.initialData.forEach(node => {
            map[node.id] = { key: node.id.toString(), id: node.id, data: node, children: [] };
            if (node.tp_parentid === node.id) {
                roots.push(map[node.id]);
            }
        });

        // Attach children to their respective parents
        this.initialData.forEach(node => {
            if (node.tp_parentid !== node.id) {
                map[node.tp_parentid].children.push(map[node.id]);
            }
        });

        this.nestedData = roots;
    }

    getNestedData() {
        return this.nestedData;
    }
}
