class CommandCore {
  constructor(xyz, toxyz, bot) {
    this.xyz = bot.entity.position
    this.toxyz = {x: bot.entity.position.x+15, y: bot.entity.position.y, z: bot.entity.position.z+15};
    this.useBlockxyz = {x: xyz.x, y: xyz.y, z: xyz.z};
    this.client = bot._client;
    this.bot = bot
    this.i = 1;
    this.refill();
  }

  refill(_xyz = this.xyz, _toxyz = this.toxyz) {
    const chunkX = Math.floor(_xyz.x / 16) * 16;
    const chunkZ = Math.floor(_xyz.z / 16) * 16;
    this.xyz = _xyz = { x: chunkX, y: 0, z: chunkZ };
    this.toxyz = _toxyz = { x: chunkX + 15, y: 0, z: chunkZ + 15 };
    this.client.chat(`/fill ${_xyz.x} ${_xyz.y} ${_xyz.z} ${_toxyz.x} ${_toxyz.y} ${_toxyz.z} command_block{TrackOutput:0b,CustomName:'{"text":"137core","color":"green","bold":true,"italic":false}'}`);
  }

  run(command) {
    this.client.write("update_command_block", { location: this.useBlockxyz, command: command.slice(0, 32767), mode: 1, flags: 0x05 });
    let coords = indexToCoords(this.i++, this.xyz, this.toxyz);
    this.useBlockxyz = coords;
  }

  runt(cmd, mode) {
    const oldcoord = this.useBlockxyz
    this.run(cmd)
    if (mode === "public") { 
      this.run(`tellraw @a {"nbt":"LastOutput","block":"${oldcoord.x} ${oldcoord.y} ${oldcoord.z}","interpret": true}`)
    } else return this.run(`tellraw ${this.bot.username} ${JSON.stringify([{text: "beezyyeezyy123 "},{nbt:"LastOutput",block: `${oldcoord.x} ${oldcoord.y} ${oldcoord.z}`}])}`)

  }

}

function indexToCoords(i, start={x:0, y:0, z:0}, end={x: 0, y: 0, z:0}) {
 let sizeX = Math.abs(end.x - start.x) + 1;
 let sizeY = Math.abs(end.y - start.y) + 1;
 let sizeZ = Math.abs(end.z - start.z) + 1;

 let x = i % sizeX;
 let y = Math.floor(i / (sizeX * sizeZ)) % sizeY;
 let z = Math.floor(i / sizeX) % sizeZ;

 return {
  x: start.x + x,
  y: start.y + y,
  z: start.z + z
 };
}

module.exports = CommandCore;
