# @ISnow-Systems/Redis-Lock
## 概要
このパッケージは`node-redis`と`redis-lock`を使用した環境から`ioredis`に移行する際に`redis-lock`の代わりとして使用できるパッケージです。

## 使用方法
`redis-lock`の代わりにインストールして、そのままご利用ください。

## インストールについて
`package.json`の依存関係指定時に以下のようにしてください。
```json
{
  "ioredis": "^5.5.0",
  "redis-lock": "npm:@isnow-systems/redis-lock@^0.1.0"
}
```

## 免責条項
本パッケージを用いた事による如何なる損害について、当方は一切の責任を負いません。
