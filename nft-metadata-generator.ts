interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
  external_url?: string;
}

export class NftMetadataGenerator {
  generateRandomMetadata(baseImageUrl: string, tokenId: number): NFTMetadata {
    const traits = [
      { trait_type: "Rarity", value: ["Common", "Rare", "Epic", "Legendary"][Math.floor(Math.random() * 4)] },
      { trait_type: "Level", value: Math.floor(Math.random() * 100) + 1 },
      { trait_type: "Element", value: ["Fire", "Water", "Earth", "Air"][Math.floor(Math.random() * 4)] }
    ];

    return {
      name: `NFT #${tokenId}`,
      description: `Unique NFT Asset #${tokenId} on EVM Chain`,
      image: `${baseImageUrl}/${tokenId}.png`,
      attributes: traits,
      external_url: `https://nft-collection.com/token/${tokenId}`
    };
  }

  formatMetadataForIpfs(metadata: NFTMetadata): string {
    return JSON.stringify(metadata, null, 2);
  }
}
