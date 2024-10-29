
```shell
pnpm install

cd server && pnpm prisma generate

cd .. && pnpm run dev

pip install fastapi sqlalchemy aiosqlite    
pip install uvicorn
uvicorn main:app --host 0.0.0.0 --port 3000
```

