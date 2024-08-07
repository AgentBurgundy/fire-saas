/**
 * Creates a Stripe Customer Portal link.
 *
 * This function makes an API call to the server to generate a Stripe Customer Portal URL.
 * The portal allows customers to manage their subscriptions and billing information.
 *
 * @async
 * @returns {Promise<string>} A promise that resolves to the Stripe Customer Portal URL.
 * @throws {Error} If there's an issue creating the portal link or if the response is invalid.
 *
 * @example
 * try {
 *   const portalUrl = await createPortalLink();
 *   window.location.href = portalUrl;
 * } catch (error) {
 *   console.error('Failed to create portal link:', error);
 *   // Handle the error (e.g., show an error message to the user)
 * }
 */
export default async function createPortalLink(): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/portal`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { url } = await response.json();

    if (!url) {
      throw new Error("Portal URL not found in the response");
    }

    return url;
  } catch (error) {
    console.error("Error creating portal link:", error);
    throw new Error("Failed to create Stripe portal link");
  }
}
