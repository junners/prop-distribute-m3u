# props-distribute-m3u

a quick and easy tool to provide categorization to m3u titles that is fed to [mptv-iptv](https://github.com/junners/mpv-iptv) 

## Installation

clone this repo and install dependencies:

```sh
git clone 
npm install
```

## Usage

- Place the m3u file on the project base directory and name it ```playlist.m3u```
- run ```npm start```
- load the playlist using ```mpv --script-opts=iptv=1 emitted.m3u```