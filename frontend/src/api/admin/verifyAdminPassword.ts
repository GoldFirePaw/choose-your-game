export const verifyAdminPassword = async (adminPassword: string) => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/admin/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminPassword }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error verifying admin password:", error);
    return false;
  }
};
