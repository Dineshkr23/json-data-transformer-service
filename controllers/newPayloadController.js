const NODE_TYPES = {
  TEXT: "text",
  ATTACHMENT: "attachment",
  INTERACTIVE: "interactive",
  TEMPLATE: "template",
  CATALOG: "catalog",
  STARTNODE: "startNode",
};

const SUB_TYPES = {
  BUTTON: "button",
  LIST: "list",
  FLOW: "flow",
};

let updatedEdges = [];

async function generateNodesPayload(nodes, edges) {
  const groupedNodes = new Set();
  const groupPayloads = [];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edgeMap = edges.reduce((acc, edge) => {
    if (!acc.has(edge.source)) acc.set(edge.source, []);
    acc.get(edge.source).push(edge);
    return acc;
  }, new Map());

  const handleTargets = (nodeId, sourceHandle = null) => {
    const nodeEdges = (edgeMap.get(nodeId) || []).filter((e) =>
      sourceHandle ? e.sourceHandle === sourceHandle : true
    );

    const targets = nodeEdges.map((e) => e.target);
    return targets;
  };

  const generateNodePayload = (node) => {
    if (!node || groupedNodes.has(node.id)) return null;

    const delay = node.data?.delay ? { delay: node.data.delay } : {};

    switch (node.type) {
      case NODE_TYPES.STARTNODE:
        return generateStartNode(node, handleTargets);
      case NODE_TYPES.TEXT:
        return generateTextNode(node, delay);
      case "image":
      case "video":
      case "audio":
      case "document":
        return generateAttachmentNode(node, delay);
      case "list":
        return generateListNode(node, delay, handleTargets);
      case "button":
        return generateButtonNode(node, delay, handleTargets);
      case "flow":
        return generateFlowNode(node, delay, handleTargets);
      case NODE_TYPES.CATALOG:
        return generateCatalogNode(node, delay);
      case NODE_TYPES.TEMPLATE:
        return generateTemplateNode(node, delay, handleTargets);
      default:
        return null;
    }
  };

  const basePayload = nodes.map(generateNodePayload).filter(Boolean);
  return [...basePayload, ...groupPayloads];
}

// --- NODE GENERATORS ---

function generateTextNode(node, delay) {
  return {
    id: node.id,
    type: NODE_TYPES.TEXT,
    data: {
      body: { text: node.data.body },
      preview_url: true,
    },
    ...delay,
  };
}

function generateAttachmentNode(node, delay) {
  return {
    id: node.id,
    type: NODE_TYPES.ATTACHMENT,
    sub_type: node.type,
    data: {
      media: node.data.media,
      caption: node.data.caption,
    },
    ...delay,
  };
}

function generateListNode(node, delay, handleTargets) {
  return {
    id: node.id,
    type: NODE_TYPES.INTERACTIVE,
    sub_type: SUB_TYPES.LIST,
    data: {
      header: { type: "text", text: node.data.header },
      body: { text: node.data.body },
      action: {
        button: node.data.btnText,
        sections: [
          {
            title: node.data.btnText,
            rows: node.data.listOptions.map((opt) => ({
              id: opt.title?.replace(/\s+/g, "_"),
              title: opt.title,
              target: handleTargets(node.id, `${node.id}@@${opt.id}`),
            })),
          },
        ],
      },
    },
    ...delay,
  };
}

function generateButtonNode(node, delay, handleTargets) {
  return {
    id: node.id,
    type: NODE_TYPES.INTERACTIVE,
    sub_type: SUB_TYPES.BUTTON,
    data: {
      header:
        node.data.headerType === "text"
          ? { type: "text", text: node.data.header }
          : {
              type: node.data.headerType,
              [node.data.headerType]: node.data.media,
            },
      body: { text: node.data.body },
      action: {
        buttons: node.data.btnOptions.map((opt) => ({
          type: "reply",
          reply: {
            id: opt.title?.replace(/\s+/g, "_"),
            title: opt.title,
            target: handleTargets(node.id, `${node.id}@@${opt.id}`),
          },
        })),
      },
    },
    ...delay,
  };
}

function generateFlowNode(node, delay, handleTargets) {
  return {
    id: node.id,
    type: NODE_TYPES.INTERACTIVE,
    sub_type: SUB_TYPES.FLOW,
    data: {
      header:
        node.data.headerType === "text"
          ? { type: "text", text: node.data.header }
          : {
              type: node.data.headerType,
              [node.data.headerType]: node.data.media,
            },
      body: { text: node.data.body },
      action: { flow: node.data.flowId },
      btnText: node.data.btnText,
      target: handleTargets(node.id),
    },
    ...delay,
  };
}

function generateCatalogNode(node, delay) {
  const base = {
    id: node.id,
    type: NODE_TYPES.CATALOG,
    sub_type: node.data.catalogue_type,
    data: {
      body: { text: node.data.catalog_body },
    },
    ...delay,
  };

  if (node.data.catalogue_type === "product_list") {
    base.data.header = { type: "text", text: node.data.catalog_header };
    base.data.action = {
      btn_text: node.data.catalog_btn_text,
      catalog_id: node.data.catalog_id,
      product_set_ids: node.data.product_set_ids,
    };
  } else if (node.data.catalogue_type === "product") {
    base.data.action = {
      catalog_id: node.data.catalog_id,
      product_retailer_id: node.data.product_id,
    };
  }

  return base;
}

function generateTemplateNode(node, delay, handleTargets) {
  const templateOptions = JSON.parse(node.data.template?.options || "[]");

  return {
    id: node.id,
    type: NODE_TYPES.TEMPLATE,
    data: {
      templateId: node.data.template?.templateId,
      ...(["IMAGE", "VIDEO", "DOCUMENT"].includes(
        node.data.template?.templateType
      ) && {
        media: {
          type: node.data.template?.templateType.toLowerCase(),
          [node.data.template?.templateType.toLowerCase()]: node.data.media,
        },
      }),
      ...(templateOptions.length > 0 && {
        template_options: templateOptions.map((opt, idx) => ({
          type: opt.type,
          [opt.type]: {
            id: opt[opt.type].id,
            ...(opt.type === "button" && {
              title: opt[opt.type].title,
            }),
            target: handleTargets(node.id, `${node.id}@@text${idx}`),
          },
        })),
      }),
    },
    ...delay,
  };
}

function generateStartNode(node, handleTargets) {
  return {
    id: node.id,
    type: "triggers",
    data: {
      target: handleTargets(node.id, "startNodeOut"),
    },
  };
}

function sanitizeBlocks(blocks) {
  return blocks.map((block) => {
    if (block.type === "template") {
      const template = block?.data?.template;

      if (typeof template === "string") {
        return block;
      }

      if (typeof template === "object" && template !== null) {
        const { components, raw_data, ...cleanedTemplate } = template;

        return {
          ...block,
          data: {
            ...block.data,
            template: cleanedTemplate,
          },
        };
      }
    }

    return block;
  });
}

const newPayload = async (req, res) => {
  try {
    const { flowConfig } = req.body;
    if (!flowConfig) {
      return res.status(400).json({
        error: "Flow Config is required",
      });
    }

    let { frontEndNodes, frontEndEdges } = flowConfig;

    const sanitizedNodes = sanitizeBlocks(frontEndNodes);

    const updatedNodes = await generateNodesPayload(
      sanitizedNodes,
      frontEndEdges
    );

    const uniqueBackendEdges = updatedEdges.filter(
      (obj, index, self) =>
        index ===
        self.findIndex((o) => JSON.stringify(o) === JSON.stringify(obj))
    );

    const payload = {
      flowConfig: {
        edges:
          uniqueBackendEdges.length === 0 ? frontEndEdges : uniqueBackendEdges,
        nodes: updatedNodes,
        frontEndNodes: sanitizedNodes,
        frontEndEdges,
      },
    };

    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default newPayload;
