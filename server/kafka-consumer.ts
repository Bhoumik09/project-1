// kafka-consumer.ts
import { Kafka } from "kafkajs"
import { saveAnalyticsEvent } from "./database"

export async function startConsumer() {
  if (!process.env.KAFKA_BROKER) {
    console.log("[v0] Kafka not configured, exiting consumer")
    return
  }

  const kafka = new Kafka({
    clientId: "connect-four-analytics",
    brokers: [process.env.KAFKA_BROKER],
  })

  // === FIX: Change Group ID to force re-reading of messages ===
  const consumer = kafka.consumer({ groupId: "analytics-group-v2" }) 

  try {
    await consumer.connect()
    console.log("[v0] Kafka consumer connected")

    // Optional: Add logging for rebalancing events to debug in future
    consumer.on('consumer.group_join', ({ payload }) => {
        console.log('[v0] Consumer joined group:', payload)
    })

    await consumer.subscribe({ topic: "game-analytics", fromBeginning: true })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const eventString = message.value?.toString() || "{}"
          const event = JSON.parse(eventString)

          console.log("[v0] Processing Analytics Event:", event.type)

          // Save to Database
          await saveAnalyticsEvent(event)

        } catch (err) {
          console.error("[v0] Error processing message:", err)
        }
      },
    })
  } catch (error) {
    console.error("[v0] Kafka Consumer Error:", error)
  }
}