import { create } from 'ipfs-http-client';

export class IpfsFileUploader {
  private ipfs;

  constructor(host: string = 'localhost', port: number = 5001, protocol: string = 'http') {
    this.ipfs = create({ host, port, protocol });
  }

  async uploadText(content: string): Promise<string> {
    const result = await this.ipfs.add(content);
    return `ipfs://${result.cid.toString()}`;
  }

  async uploadFile(file: Buffer | Blob, fileName: string): Promise<string> {
    const result = await this.ipfs.add({
      path: fileName,
      content: file
    });
    return `ipfs://${result.cid.toString()}`;
  }

  async getFile(cid: string): Promise<string> {
    const decoder = new TextDecoder();
    let content = '';
    for await (const chunk of this.ipfs.cat(cid.replace('ipfs://', ''))) {
      content += decoder.decode(chunk);
    }
    return content;
  }
}
