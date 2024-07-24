import path from 'path';
import fs from 'fs';

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const name = 'projects/gogumarket/secrets/gogu-market-secret-gcp-storage-keyfile';
const member = 'serviceAccount:e1ig0s@gogumarket.iam.gserviceaccount.com';

const client = new SecretManagerServiceClient();

async function grantAccess() {
    const [policy] = await client.getIamPolicy({
        resource: name,
    });

    policy.bindings.push({
        role: 'roles/secretmanager.secretAccessor',
        members: [member],
    });

    await client.setIamPolicy({
        resource: name,
        policy: policy,
    });

    console.log(`Updated IAM policy for ${name}`);
}

const name_version = 'projects/gogumarket/secrets/gogu-market-secret-gcp-storage-keyfile/versions/1';

async function accessSecretVersion() {
    try {
        const [version] = await client.accessSecretVersion({
            name: name_version,
        });

        const payload = JSON.parse(version.payload.data.toString());

        const filePath = path.join(process.cwd(), 'gogumarket-b753518ff1af.json');
        await fs.writeFileSync(filePath, JSON.stringify(payload, null, 4));

        console.info(`Payload saved to ${filePath}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

grantAccess();
accessSecretVersion();
