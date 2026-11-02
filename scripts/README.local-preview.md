# Local website preview

From `D:\myresearchguide`, run:

```powershell
npm run preview:local
```

After the build finishes, open **http://myresearchguide.localhost:3000/**. This address
points to the same loopback server at `127.0.0.1:3000`; it does not publish the
website or require a hosts-file change. Use this address for the preview because
the old `127.0.0.1` browser tabs stopped responding during earlier failed loads.

The preview command disables local response compression, uses fresh build asset
URLs, disables browser caching, closes HTTP connections after each response,
and buffers GET responses before sending them. These workarounds apply to the local preview only. Normal
`npm run build` / `npm start` and Vercel do not use the custom preview server.
