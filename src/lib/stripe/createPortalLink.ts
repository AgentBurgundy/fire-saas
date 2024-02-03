export default async function createPortalLink() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/portal`
  );

  const { url } = await response.json();

  return url;
}
