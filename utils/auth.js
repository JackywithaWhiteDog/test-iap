const metadata = require('gcp-metadata')
import { OAuth2Client } from 'google-auth-library'

const oAuth2Client = new OAuth2Client();

// Cache externally fetched information for future invocations
let aud;

const audience = async () => {
    if (!aud && (await metadata.isAvailable())) {
        let project_number = await metadata.project('561205227723');
        let project_id = await metadata.project('testing-321905');

        aud = '/projects/' + project_number + '/apps/' + project_id;
    }

    return aud;
}

export const validateAssertion = async (assertion) => {
    if (!assertion) return {};

    const aud = await audience();

    const response = await oAuth2Client.getIapPublicKeys();

    const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
        assertion,
        response.pubkeys,
        aud,
        ['https://cloud.google.com/iap']
    );
    const payload = ticket.getPayload();

    return {
        payload: payload,
        response: response,
        ticket: ticket,
        aud: aud
    };
}