import { Database } from "bun:sqlite";
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { Reminders } from "../Reminders";
import { migrate } from "@/database/migrate";

describe("Reminders", () => {
  let db: Database;
  let reminders: Reminders;

  beforeEach(async () => {
    db = new Database(":memory:");
    await migrate(db);
    reminders = new Reminders(db);
  });

  afterEach(() => {
    db.close();
  });

  describe("create", () => {
    it("should create a reminder successfully", () => {
      const remindAt = new Date(Date.now() + 60000);
      const id = reminders.create({
        chatId: -123456,
        userId: 789,
        messageId: 100,
        reminderText: "Test reminder",
        remindAt,
      });

      expect(id).toBeGreaterThan(0);

      const reminder = reminders.getById(id);
      expect(reminder).toBeTruthy();
      expect(reminder?.chat_id).toBe(-123456);
      expect(reminder?.user_id).toBe(789);
      expect(reminder?.message_id).toBe(100);
      expect(reminder?.reminder_text).toBe("Test reminder");
      expect(reminder?.sent).toBe(0);
    });

    it("should create a reminder with minimal options", () => {
      const remindAt = new Date(Date.now() + 60000);
      const id = reminders.create({
        chatId: -123456,
        userId: 789,
        remindAt,
      });

      expect(id).toBeGreaterThan(0);

      const reminder = reminders.getById(id);
      expect(reminder).toBeTruthy();
      expect(reminder?.message_id).toBeNull();
      expect(reminder?.reply_to_message_id).toBeNull();
      expect(reminder?.reminder_text).toBeNull();
    });
  });

  describe("getPendingReminders", () => {
    it("should return only pending reminders that are due", () => {
      const past = new Date(Date.now() - 60000);
      const future = new Date(Date.now() + 60000);

      reminders.create({
        chatId: -1,
        userId: 1,
        reminderText: "Past reminder",
        remindAt: past,
      });

      reminders.create({
        chatId: -1,
        userId: 1,
        reminderText: "Future reminder",
        remindAt: future,
      });

      const pending = reminders.getPendingReminders();
      expect(pending).toHaveLength(1);
      expect(pending[0].reminder_text).toBe("Past reminder");
    });

    it("should not return already sent reminders", () => {
      const past = new Date(Date.now() - 60000);

      const id = reminders.create({
        chatId: -1,
        userId: 1,
        reminderText: "Sent reminder",
        remindAt: past,
      });

      reminders.markAsSent(id);

      const pending = reminders.getPendingReminders();
      expect(pending).toHaveLength(0);
    });

    it("should respect the limit parameter", () => {
      const past = new Date(Date.now() - 60000);

      for (let i = 0; i < 5; i++) {
        reminders.create({
          chatId: -1,
          userId: 1,
          reminderText: `Reminder ${i}`,
          remindAt: past,
        });
      }

      const pending = reminders.getPendingReminders(3);
      expect(pending).toHaveLength(3);
    });
  });

  describe("markAsSent", () => {
    it("should mark a reminder as sent", () => {
      const past = new Date(Date.now() - 60000);
      const id = reminders.create({
        chatId: -1,
        userId: 1,
        remindAt: past,
      });

      reminders.markAsSent(id);

      const reminder = reminders.getById(id);
      expect(reminder?.sent).toBe(1);
      expect(reminder?.sent_at).toBeTruthy();
    });
  });

  describe("getUserReminders", () => {
    it("should return reminders for a specific user and chat", () => {
      const future = new Date(Date.now() + 60000);

      reminders.create({
        chatId: -1,
        userId: 100,
        reminderText: "User 100 reminder",
        remindAt: future,
      });

      reminders.create({
        chatId: -1,
        userId: 200,
        reminderText: "User 200 reminder",
        remindAt: future,
      });

      reminders.create({
        chatId: -2,
        userId: 100,
        reminderText: "Different chat reminder",
        remindAt: future,
      });

      const userReminders = reminders.getUserReminders(-1, 100);
      expect(userReminders).toHaveLength(1);
      expect(userReminders[0].reminder_text).toBe("User 100 reminder");
    });

    it("should not return sent reminders", () => {
      const future = new Date(Date.now() + 60000);

      const id = reminders.create({
        chatId: -1,
        userId: 100,
        reminderText: "Sent reminder",
        remindAt: future,
      });

      reminders.markAsSent(id);

      const userReminders = reminders.getUserReminders(-1, 100);
      expect(userReminders).toHaveLength(0);
    });
  });

  describe("deleteReminder", () => {
    it("should delete a reminder", () => {
      const future = new Date(Date.now() + 60000);
      const id = reminders.create({
        chatId: -1,
        userId: 1,
        remindAt: future,
      });

      const deleted = reminders.deleteReminder(id);
      expect(deleted).toBe(true);

      const reminder = reminders.getById(id);
      expect(reminder).toBeNull();
    });

    it("should not delete a sent reminder", () => {
      const past = new Date(Date.now() - 60000);
      const id = reminders.create({
        chatId: -1,
        userId: 1,
        remindAt: past,
      });

      reminders.markAsSent(id);

      const deleted = reminders.deleteReminder(id);
      expect(deleted).toBe(false);

      const reminder = reminders.getById(id);
      expect(reminder).toBeTruthy();
    });

    it("should return false when deleting non-existent reminder", () => {
      const deleted = reminders.deleteReminder(99999);
      expect(deleted).toBe(false);
    });
  });
});
