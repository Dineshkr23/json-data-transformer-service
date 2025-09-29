import { v4 as uuidv4 } from "uuid";

const transformCampaignPayload = (inputArray) => {
  if (!Array.isArray(inputArray) || inputArray.length === 0) {
    throw new Error("Input must be a non-empty array");
  }

  // Generate UUIDs for each template
  const nodeIds = inputArray.map(() => uuidv4());
  const plusIconId = `plus-${uuidv4()}`;

  // Create edges connecting templates sequentially
  const edges = [];
  const frontEndEdges = [];

  for (let i = 0; i < nodeIds.length - 1; i++) {
    const edgeId = `${nodeIds[i]}-${nodeIds[i + 1]}`;
    edges.push({
      id: edgeId,
      source: nodeIds[i],
      target: nodeIds[i + 1],
      type: "custom",
      animated: true,
      data: {
        isConditional: false,
      },
    });
    frontEndEdges.push({
      id: edgeId,
      source: nodeIds[i],
      target: nodeIds[i + 1],
      type: "custom",
      animated: true,
      data: {
        isConditional: false,
      },
    });
  }

  // Add edge from last template to plus icon
  const lastEdgeId = `${nodeIds[nodeIds.length - 1]}-${plusIconId}`;
  frontEndEdges.push({
    id: lastEdgeId,
    source: nodeIds[nodeIds.length - 1],
    target: plusIconId,
    type: "custom",
    animated: true,
    data: {
      isConditional: false,
    },
  });

  // Create backend nodes
  const nodes = inputArray.map((template, index) => {
    const nodeId = nodeIds[index];
    const nextNodeId = index < nodeIds.length - 1 ? nodeIds[index + 1] : null;

    // Transform template_options to include target references
    const templateOptions = template.data.template_options.map((option) => ({
      ...option,
      state: {
        ...option.state,
        target: nextNodeId ? [nextNodeId] : [],
      },
    }));

    return {
      id: nodeId,
      type: "template",
      messageName: template.messageName,
      broadcastId: template.broadcastId,
      data: {
        ...template.data,
        template_options: templateOptions,
      },
      delay: template.delay,
    };
  });

  // Create frontend nodes
  const frontEndNodes = inputArray.map((template, index) => {
    const nodeId = nodeIds[index];

    const x = -366;
    const y = 6 + index * 800;

    // Transform carouselMedia from array to object format
    const carouselMedia = {};
    if (
      template.data.carouselMedia &&
      Array.isArray(template.data.carouselMedia)
    ) {
      template.data.carouselMedia.forEach((media, mediaIndex) => {
        if (media.type === "image" && media.image) {
          carouselMedia[mediaIndex] = media.image;
        } else if (media.type === "video" && media.video) {
          carouselMedia[mediaIndex] = media.video;
        }
      });
    }

    return {
      id: nodeId,
      type: "template",
      position: { x, y },
      data: {
        label: template.messageName,
        messageName: template.messageName,
        type: "message",
        template: template.data.templateId,
        media:
          template.data.media?.image ||
          template.data.media?.video ||
          template.data.media,
        dynamic_mapping: template.data.dynamic_mapping,
        product_sets: template.data.product_sets,
        carouselMedia: carouselMedia,
        delay: template.delay,
      },
      measured: {
        width: 320,
        height: 437,
      },
      selected: false,
      dragging: false,
    };
  });

  // Add plus icon node
  const lastNodeId = nodeIds[nodeIds.length - 1];
  const lastNode = frontEndNodes[frontEndNodes.length - 1];

  frontEndNodes.push({
    id: plusIconId,
    type: "plusIcon",
    position: {
      x: lastNode.position.x,
      y: lastNode.position.y + 800,
    },
    data: {
      source: lastNodeId,
    },
    measured: {
      width: 60,
      height: 60,
    },
    selected: false,
    dragging: false,
  });

  return {
    flowConfig: {
      edges,
      nodes,
      frontEndNodes,
      frontEndEdges,
    },
  };
};

const newCampaignPayload = async (req, res) => {
  try {
    const inputArray = req.body;

    if (!Array.isArray(inputArray)) {
      return res.status(400).json({
        error: "Input must be an array",
      });
    }

    const transformedPayload = transformCampaignPayload(inputArray);

    res.status(201).json(transformedPayload);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

export default newCampaignPayload;
