import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://gmelsocha5.execute-api.us-west-1.amazonaws.com/todos');
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch todos', error: "server error with getting TODO's" });
    }
  } else if (req.method === 'POST') {
    try {
      const body = req.body;
      const response = await fetch('https://gmelsocha5.execute-api.us-west-1.amazonaws.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      res.status(200).json({ message: 'Todo added', data });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add todo', error: "server error with writing TODO" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
