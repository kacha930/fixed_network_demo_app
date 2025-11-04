Run backend: python backend/app.py
Run frontend: cd frontend && npm install && npm run dev
Frontend proxies /api to http://localhost:5000


Render_frontend
```https://nokia-gateway-simulator-app.onrender.com```


backend is successfully deployed and running on ```https://nokia-gateway-simulator.onrender.com```

Setting	Value	Notes
Name	nokia-gateway-simulator-frontend (or similar)	A descriptive name.
Build Command	npm install && npm run build	Standard React build process.
Publish Directory	build (or dist if using Vite)	This tells Render where to find the static files after the build.