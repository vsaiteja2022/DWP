export async function getAllUsers() {

    const response = await fetch('https://bpdts-test-app.herokuapp.com/users');
    return await response.json();
}
