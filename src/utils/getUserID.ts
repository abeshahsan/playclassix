export const getAnonUserId = () => {
	if (typeof window !== "undefined") {
		let id = sessionStorage.getItem("userId");
		if (!id) {
			id = crypto.randomUUID(); // random ID
			sessionStorage.setItem("userId", id);
		}
		return id;
	}
};
