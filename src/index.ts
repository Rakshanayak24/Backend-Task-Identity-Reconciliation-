import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Browser-friendly root route
app.get("/", (req, res) => {
  res.send("Bitespeed Identity API is running ✅\nUse POST /identify to test with JSON.");
});

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "email or phone required" });
  }

  const existing = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email ?? undefined },
        { phoneNumber: phoneNumber ?? undefined }
      ]
    }
  });

  if (existing.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    });

    return res.json({
      contact: {
        primaryContactId: newContact.id, // fixed
        emails: email ? [email] : [],
        phoneNumbers: phoneNumber ? [phoneNumber] : [],
        secondaryContactIds: []
      }
    });
  }

  const primary = existing.sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )[0];

  const allLinked = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    }
  });

  const emails = new Set<string>();
  const phones = new Set<string>();
  const secondary: number[] = [];

  allLinked.forEach(c => {
    if (c.email) emails.add(c.email);
    if (c.phoneNumber) phones.add(c.phoneNumber);
    if (c.linkPrecedence === "secondary") secondary.push(c.id);
  });

  if ((email && !emails.has(email)) || (phoneNumber && !phones.has(phoneNumber))) {
    const sec = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: "secondary"
      }
    });

    secondary.push(sec.id);
    if (email) emails.add(email);
    if (phoneNumber) phones.add(phoneNumber);
  }

  res.json({
    contact: {
      primaryContactId: primary.id, // fixed
      emails: Array.from(emails),
      phoneNumbers: Array.from(phones),
      secondaryContactIds: secondary
    }
  });
});

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});
