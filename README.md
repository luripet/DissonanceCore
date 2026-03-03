> [!IMPORTANT]
> ## Project Archival
> 
> **This project is no longer actively maintained and this repository has been archived.**
>
> We want to thank all contributors and users for their support over the project's lifetime. While development has ceased, the code remains available for those who may find it useful.

# Dissonance [![Discord](https://img.shields.io/discord/1196075698301968455?style=social&logo=discord&label=Dissonance)](https://discord.gg/XjYgWXHb9Q)
A mod for Discord's mobile apps.

## Installing

### Android

- **Root** with Xposed - [DissonanceXposed](https://github.com/dissonance/DissonanceXposed/releases/latest)
- **Non-root** - [DissonanceManager](https://github.com/dissonance/DissonanceManager/releases/latest)

### iOS
- [**DissonanceTweak**](https://github.com/dissonance/DissonanceTweak) - Get prebuilt rootful and rootless `.deb` files or the prepatched `.ipa `

## Building
1. Install a Dissonance loader with loader config support (any mentioned in the [Installing](#installing) section).
1. Go to Settings > General and enable Developer Settings.
1. Clone the repo:
    ```
    git clone https://github.com/dissonance/Dissonance
    ```
1. Install dependencies:
    ```
    pnpm i
    ```
1. Build Dissonance's code:
    ```
    pnpm build
    ```
1. In the newly created `dist` directory, run a HTTP server. I recommend [http-server](https://www.npmjs.com/package/http-server).
1. Go to Settings > Developer enabled earlier. Enable `Load from custom url` and input the IP address and port of the server (e.g. `http://192.168.1.236:4040/dissonance.js`) in the new input box labelled `Dissonance URL`.
1. Restart Discord. Upon reload, you should notice that your device will download Dissonance's bundled code from your server, rather than GitHub.
1. Make your changes, rebuild, reload, go wild!

Alternatively, you can directly *serve* the bundled code by running `pnpm serve`. `dissonance.js` will be served on your local address under the port 4040. You will then insert `http://<local ip address>:4040/dissonance.js` as a custom url and reload. Whenever you restart your mobile client, the script will rebuild the bundle as your client fetches it.
