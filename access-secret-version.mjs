import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const name = 'projects/gogumarket/secrets/gogu-market-secret-gcp-storage-keyfile/versions/1';

const client = new SecretManagerServiceClient();

async function accessSecretVersion() {
    try {
        const [version] = await client.accessSecretVersion({
            name: name,
        });

        const payload = JSON.parse(version.payload.data.toString());

        const filePath = path.join(process.cwd(), process.env.GCP_STORAGE_KEYFILE);
        await fs.writeFileSync(filePath, JSON.stringify(payload, null, 4));

        console.info(`Payload saved to ${filePath}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

accessSecretVersion();
