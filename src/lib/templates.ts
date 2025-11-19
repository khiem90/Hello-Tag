import { NameTagData } from "@/types/name-tag";
import { createDefaultTag } from "./name-tag";

export type Template = {
  id: string;
  name: string;
  category: "Playful" | "Professional" | "Event" | "Simple";
  data: NameTagData;
};

export const templates: Template[] = [
  {
    id: "kawaii-fun",
    name: "Kawaii Fun",
    category: "Playful",
    data: {
      ...createDefaultTag(),
      accent: "#A96CFF",
      background: "gradient-sunset",
      textAlign: "center",
      fields: [
        {
          id: "t1",
          name: "Greeting",
          text: "HELLO",
          x: 50,
          y: 30,
          fontSize: 24,
          color: "#FFFFFF",
          visible: true,
        },
        {
          id: "t2",
          name: "Name",
          text: "Name Here",
          x: 50,
          y: 60,
          fontSize: 48,
          color: "#FFFFFF",
          visible: true,
        },
      ],
    },
  },
  {
    id: "simple-hello",
    name: "Classic Hello",
    category: "Simple",
    data: {
      ...createDefaultTag(),
      accent: "#FF7865",
      background: "gradient-warm",
      textAlign: "center",
      fields: [
        {
            id: "t1",
            name: "Header",
            text: "HELLO",
            x: 50,
            y: 25,
            fontSize: 32,
            color: "#FFFFFF",
            visible: true,
        },
        {
            id: "t2",
            name: "Subheader",
            text: "my name is",
            x: 50,
            y: 40,
            fontSize: 18,
            color: "#FFFFFF",
            visible: true,
        }
      ]
    },
  },
  {
    id: "tech-conf",
    name: "Tech Conference",
    category: "Event",
    data: {
      ...createDefaultTag(),
      accent: "#5BC8FF",
      background: "gradient-ocean",
      textAlign: "left",
      fields: [
        {
            id: "t1",
            name: "Name",
            text: "Dev Name",
            x: 10,
            y: 40,
            fontSize: 36,
            color: "#FFFFFF",
            visible: true,
        },
        {
            id: "t2",
            name: "Role",
            text: "Full Stack Developer",
            x: 10,
            y: 65,
            fontSize: 18,
            color: "#E0F2FE",
            visible: true,
        }
      ]
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    category: "Professional",
    data: {
      ...createDefaultTag(),
      accent: "#4A4A4A",
      background: "custom",
      customBackground: "#FFFFFF",
      textAlign: "center",
      fields: [
        {
            id: "t1",
            name: "Name",
            text: "Firstname Lastname",
            x: 50,
            y: 50,
            fontSize: 32,
            color: "#000000",
            visible: true,
        }
      ]
    },
  }
];

