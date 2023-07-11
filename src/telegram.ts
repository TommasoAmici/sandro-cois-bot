import config from "@/config";

export async function getFile(fileID: string) {
  const url = `https://api.telegram.org/bot${config.telegramToken}/getFile?file_id=${fileID}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const json = await res.json<{
    ok: boolean;
    result: {
      file_path: string;
      file_id: string;
      file_unique_id: string;
      file_size: number;
    };
  }>();
  return json;
}
