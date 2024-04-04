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

// export class NestedConverter {
//     constructor(initialData) {
//         this.initialData = initialData;
//         this.nestedData = [];
//         this.buildNestedData();
//     }

//     buildNestedData() {
//         const map = {};
//         const roots = [];

//         // Create a mapping of id to node
//         this.initialData.forEach(node => {
//             map[node.id] = { key: node.id.toString(), id: node.id, data: node, children: [] };
//         });

//         // Attach children to their respective parents
//         this.initialData.forEach(node => {
//             if (node.tp_parentid !== node.id) {
//                 map[node.tp_parentid].children.push(map[node.id]);
//             } else {
//                 // If tp_parentid is same as id, it means it's a root node
//                 roots.push(map[node.id]);
//             }
//         });

//         this.nestedData = roots;
//     }

//     getNestedData() {
//         return this.nestedData;
//     }
// }

// export class NestedConverter {
//     constructor(initialData) {
//         this.initialData = initialData;
//         this.nestedData = [];
//         this.buildNestedData();
//     }

//     buildNestedData() {
//         const map = {};
//         let roots = [];

//         // Create a mapping of id to node
//         this.initialData.forEach(node => {
//             map[node.id] = { key: node.id.toString(), id: node.id, data: node, children: [] };
//         });

//         // Attach children to their respective parents
//         this.initialData.forEach(node => {
//             if (node.tp_parentid !== node.id) {
//                 map[node.tp_parentid].children.push(map[node.id]);
//             } else {
//                 // If tp_parentid is same as id, it means it's a root node
//                 roots.push(map[node.id]);
//             }
//         });

//         // Filter out roots that don't have any children
//         roots = roots.filter(root => root.children.length > 0);

//         this.nestedData = roots;
//     }

//     getNestedData() {
//         return this.nestedData;
//     }
// }

// -----------
// export class NestedConverter {
//     constructor(initialData) {
//         this.initialData = initialData;
//         this.nestedData = [];
//         this.buildNestedData();
//     }

//     buildNestedData() {
//         const map = {};
//         const roots = [];

//         // Create a mapping of id to node and find root nodes
//         this.initialData.forEach(node => {
//             map[node.id] = { key: node.id.toString(), id: node.id, data: node, children: [] };
//             if (node.tp_parentid === node.id) {
//                 roots.push(map[node.id]);
//             }
//         });

//         // Attach children to their respective parents
//         this.initialData.forEach(node => {
//             if (node.tp_parentid !== node.id) {
//                 const parentNode = map[node.tp_parentid];
//                 if (parentNode) {
//                     parentNode.children.push(map[node.id]);
//                 }
//             }
//         });

//         this.nestedData = roots;
//     }

//     getNestedData() {
//         return this.nestedData;
//     }
// }

// export class NestedConverter {
//     constructor(initialData) {
//         this.initialData = initialData;
//         this.nestedData = [];
//         this.buildNestedData();
//     }

//     buildNestedData() {
//         const map = {};
//         const roots = [];

//         // Create a mapping of id to node
//         this.initialData.forEach(node => {
//             map[node.id] = { key: node.id.toString(), id: node.id, data: node, children: [] };
//         });

//         // Attach children to their respective parents
//         this.initialData.forEach(node => {
//             const parentNode = map[node.tp_parentid];
//             if (parentNode) {
//                 parentNode.children.push(map[node.id]);
//             } else {
//                 roots.push(map[node.id]); // Nodes with no parent are considered as root
//             }
//         });

//         this.nestedData = roots;
//     }

//     getNestedData() {
//         return this.nestedData;
//     }
// }

// export class NestedConverter {
//     constructor(initialData) {
//         this.initialData = initialData;
//         this.nestedData = [];
//         this.buildNestedData();
//     }

//     buildNestedData() {
//         const map = {};
//         const roots = [];

//         // Create a mapping of id to node
//         this.initialData.forEach(node => {
//             map[node.id] = { key: node.id.toString(), id: node.id, data: node, children: [] };
//         });

//         // Attach children to their respective parents
//         this.initialData.forEach(node => {
//             const parentNode = map[node.tp_parentid];
//             if (parentNode) {
//                 parentNode.children.push(map[node.id]);
//             } else {
//                 // If parent node doesn't exist, consider it as root
//                 roots.push(map[node.id]);
//             }
//         });

//         // Find the root nodes dynamically if there's no root
//         if (roots.length === 0) {
//             Object.values(map).forEach(node => {
//                 if (node.data.tp_parentid === node.data.id) {
//                     roots.push(node);
//                 }
//             });
//         }

//         this.nestedData = roots;
//     }

//     getNestedData() {
//         return this.nestedData;
//     }
// }

// export class NestedConverter {
//     constructor(initialData) {
//         this.initialData = initialData;
//         this.nestedData = [];
//         this.visited = new Set();
//         this.buildNestedData();
//     }

//     buildNestedData() {
//         const map = {};
//         const roots = [];

//         // Create a mapping of id to node
//         this.initialData.forEach(node => {
//             map[node.id] = { key: node.id.toString(), id: node.id, data: node, children: [] };
//         });

//         // Attach children to their respective parents
//         this.initialData.forEach(node => {
//             this.attachChildren(map, node, roots);
//         });

//         this.nestedData = roots;
//     }

//     attachChildren(map, node, roots) {
//         if (this.visited.has(node.id)) {
//             return;
//         }

//         const parentNode = map[node.tp_parentid];
//         if (parentNode) {
//             parentNode.children.push(map[node.id]);
//             this.visited.add(node.id);

//             // Recursively attach children
//             this.initialData.forEach(childNode => {
//                 if (childNode.tp_parentid === node.id) {
//                     this.attachChildren(map, childNode, roots);
//                 }
//             });
//         } else {
//             roots.push(map[node.id]);
//         }
//     }

//     getNestedData() {
//         return this.nestedData;
//     }
// }


// export class NestedConverter {
//     constructor(initialData) {
//         this.initialData = initialData;
//         this.nestedData = [];
//         this.buildNestedData();
//     }

//     buildNestedData() {
//         const map = new Map();

//         // Create a mapping of id to node
//         this.initialData.forEach(node => {
//             map.set(node.id, { key: node.id.toString(), id: node.id, data: node, children: [] });
//         });

//         // Attach children to their respective parents
//         this.initialData.forEach(node => {
//             const parentNode = map.get(node.tp_parentid);
//             if (parentNode) {
//                 const currentNode = map.get(node.id);
//                 if (currentNode) {
//                     parentNode.children.push(currentNode);
//                 }
//             } else if (node.tp_parentid === node.id) {
//                 this.nestedData.push(map.get(node.id));
//             }
//         });
//     }

//     getNestedData() {
//         return this.nestedData;
//     }
// }