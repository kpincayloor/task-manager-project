import cors from 'cors';

export const corsOptions = {
  origin: true,
  credentials: true,
};

export default cors(corsOptions);
