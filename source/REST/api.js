import { MAIN_URL, TOKEN } from './config';

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });
        const { data } = await response.json();

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return data;
    },
    async createTask (taskText) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: taskText }),
        });

        const { data } = await response.json();

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return data;
    },
    async updateTask (tasks) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([tasks]),
        });

        const { data } = await response.json();

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return data;
    },
    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error(response.statusText);
        }
    },
};
