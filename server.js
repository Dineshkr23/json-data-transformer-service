import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import newPayloadRoutes from "./routes/newPayload.js";
import campaignPayloadRoutes from "./routes/campaignPayload.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/", (req, res) => {
  res.send("🚀 Server running");
});

const textPayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type,
          position: { x: 317, y: 225 },
          dragHandle: ".drag-handle__custom",
          data: {
            preview_url: true,
            body: data.body.text,
          },
          measured: { width: 236, height: 174 },
          selected: false,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("Text payload Error", error);
    return null;
  }
};

const mediaPayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type: sub_type,
          position: {
            x: 186.50900417796106,
            y: 175.30974499946797,
          },
          dragHandle: ".drag-handle__custom",
          data,
          measured: { width: 302, height: 386 },
          selected: false,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("Media payload Error", error);
    return null;
  }
};

const listPayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type: sub_type,
          position: {
            x: 72.78362033719246,
            y: 289.0572359834628,
          },
          dragHandle: ".drag-handle__custom",
          data: {
            listOptions: data.action.sections[0].rows.map((btn, index) => {
              return { id: `text${index}`, title: btn.title };
            }),
            header: data.header.text,
            body: data.body.text,
            btnText: data.action.button,
          },
          measured: {
            width: 234,
            height: 181,
          },
          selected: false,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("List payload Error", error);
    return null;
  }
};

const buttonPayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type: sub_type,
          position: {
            x: 72.78362033719246,
            y: 289.0572359834628,
          },
          dragHandle: ".drag-handle__custom",
          data: {
            headerType: data.header.type,
            btnOptions: data.action.buttons.map((btn, index) => {
              return { id: `text${index}`, title: btn.reply.title };
            }),
            ...(data.header.type === "text" && { header: data.header.text }),
            ...((data.header.type === "image" ||
              data.header.type === "video" ||
              data.header.type === "document") && {
              media: data.header[data.header.type],
            }),
            body: data.body.text,
          },
          measured: {
            width: 234,
            height: 181,
          },
          selected: false,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("Button payload Error", error);
    return null;
  }
};

const flowPayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type: sub_type,
          position: {
            x: 72.78362033719246,
            y: 289.0572359834628,
          },
          dragHandle: ".drag-handle__custom",
          data: {
            headerType: data.header.type,
            ...(data.header.type === "text" && { header: data.header.text }),
            ...((data.header.type === "image" ||
              data.header.type === "video" ||
              data.header.type === "document") && {
              media: data.header[data.header.type],
            }),
            body: data.body.text,
            btnText: data.btnText,
            flowId: data.action.flow,
          },
          measured: {
            width: 234,
            height: 136,
          },
          selected: false,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("Flow payload Error", error);
    return null;
  }
};

const catalogMessagePayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type,
          position: {
            x: 141.48675632883806,
            y: 158.93943978158975,
          },
          dragHandle: ".drag-handle__custom",
          data: {
            catalogue_type: sub_type,
            catalog_body: data.body.text,
          },
          measured: {
            width: 261,
            height: 353,
          },
          selected: false,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("Catalog Message payload Error", error);
    return null;
  }
};

const productMessagePayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type,
          position: {
            x: 141.48675632883806,
            y: 158.93943978158975,
          },
          dragHandle: ".drag-handle__custom",
          data: {
            catalogue_type: sub_type,
            catalog_body: data.body.text,
            product_id: data.action.product_retailer_id,
          },
          measured: {
            width: 261,
            height: 353,
          },
          selected: false,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("Catalog Product payload Error", error);
    return null;
  }
};

const productListMessagePayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type,
          position: {
            x: 141.48675632883806,
            y: 158.93943978158975,
          },
          dragHandle: ".drag-handle__custom",
          data: {
            catalogue_type: sub_type,
            catalog_body: data.body.text,
            product_set_ids: data.action.product_set_ids,
            ...(data.header?.text && { catalog_header: data.header.text }),
            catalog_btn_text: data.action.btn_text,
          },
          measured: {
            width: 261,
            height: 353,
          },
          selected: false,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("Catalog Product List payload Error", error);
    return null;
  }
};

const templatePayload = async (type, sub_type, data) => {
  try {
    const id = uuidv4();
    const startId = uuidv4();
    const flowConfig = {
      edges: [],
      nodes: [{ id, type, sub_type, data }],
      frontEndNodes: [
        {
          id: startId,
          type: "startNode",
          position: {
            x: -206.68458729880103,
            y: 186.04391192742173,
          },
          dragHandle: ".drag-handle__custom",
          data: {},
          measured: {
            width: 112,
            height: 36,
          },
          selected: false,
          dragging: false,
        },
        {
          id,
          type,
          position: {
            x: 141.9283845391425,
            y: -28.515084634337043,
          },
          dragHandle: ".drag-handle__custom",
          data: {
            template: data.templateId,
            ...((data.media?.image ||
              data.media?.video ||
              data.media?.document) && {
              media:
                data.media.image || data.media.video || data.media.document,
            }),
          },
          measured: {
            width: 261,
            height: 526,
          },
          selected: true,
          dragging: false,
        },
      ],
      frontEndEdges: [
        {
          source: startId,
          sourceHandle: "startNodeOut",
          target: id,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${id}`,
        },
      ],
    };
    return flowConfig;
  } catch (error) {
    console.log("Template payload Error", error);
    return null;
  }
};

const payloadHandlers = {
  text: textPayload,
  image: mediaPayload,
  video: mediaPayload,
  document: mediaPayload,
  list: listPayload,
  button: buttonPayload,
  flow: flowPayload,
  catalog_message: catalogMessagePayload,
  product: productMessagePayload,
  product_list: productListMessagePayload,
  template: templatePayload,
};

const groupPayload = async (type, data) => {
  const id = uuidv4();
  const startId = uuidv4();

  const frontEndEdges = [];

  const frontEndNodes = await Promise.all(
    data.map(async (item, index) => {
      const itemId = uuidv4();

      const { type: itemType, sub_type, data: itemData } = item;

      // Determine which key to use in the handler map
      const key =
        itemType === "text" || itemType === "template" ? itemType : sub_type;
      const handler = payloadHandlers[key];

      if (!handler) {
        console.log(
          `No handler found for type: ${itemType}, sub_type: ${sub_type}`
        );
        return null;
      }

      try {
        const result = await handler(itemType, sub_type, itemData);
        const mapId = result?.frontEndNodes?.[1]?.id;
        frontEndEdges.push({
          source: startId,
          sourceHandle: "startNodeOut",
          target: mapId,
          animated: true,
          id: `xy-edge__${startId}startNodeOut-${mapId}`,
        });
        return result?.frontEndNodes?.[1] || null;
      } catch (error) {
        console.log(`Error processing ${itemType}/${sub_type}:`, error);
        return null;
      }
    })
  );

  return {
    edges: [],
    nodes: [
      {
        id,
        type,
        data: data.reduce((acc, item, index) => {
          acc[index] = item;
          return acc;
        }, {}),
      },
    ],
    frontEndNodes: [
      {
        id: startId,
        type: "startNode",
        position: {
          x: -206.68458729880103,
          y: 186.04391192742173,
        },
        dragHandle: ".drag-handle__custom",
        data: {},
        measured: {
          width: 112,
          height: 36,
        },
        selected: false,
        dragging: false,
      },
      ...frontEndNodes.filter(Boolean),
    ],
    frontEndEdges,
  };
};

app.post("/transform", async (req, res) => {
  try {
    const { type, sub_type, data } = req.body;

    if (type === "text") {
      const flowConfig = await textPayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (
      sub_type === "image" ||
      sub_type === "document" ||
      sub_type === "video"
    ) {
      const flowConfig = await mediaPayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (sub_type === "list") {
      const flowConfig = await listPayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (sub_type === "button") {
      const flowConfig = await buttonPayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (sub_type === "flow") {
      const flowConfig = await flowPayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (sub_type === "catalog_message") {
      const flowConfig = await catalogMessagePayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (sub_type === "product") {
      const flowConfig = await productMessagePayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (sub_type === "product_list") {
      const flowConfig = await productListMessagePayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (type === "template") {
      const flowConfig = await templatePayload(type, sub_type, data);
      return res.status(200).json({ flowConfig });
    }

    if (type === "group") {
      const flowConfig = await groupPayload(type, data);
      return res.status(200).json({ flowConfig });
    }
  } catch (err) {
    console.log("❌ Error", err.message);
    res.status(500).send(`❌ Error: ${err.message}`);
  }
});

app.use("/new-payload", newPayloadRoutes);

app.use("/new-campaign-payload", campaignPayloadRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
