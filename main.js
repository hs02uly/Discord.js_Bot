const http = require("http");
http.createServer(function (req, res) {
  res.write("online");
  res.end();
}).listen(8080);


const { Client, Intents, Interaction, Collection, Message, MessageEmbed, MessegeButton } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require("fs"); //ファイル読み取り
const colors = require("colors");
const guild = client.guilds.cache.get("899952674307457056")

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

client.on("ready", () => {
    console.log("Ready!起動しました！")
    guild.commands.set([])
        .then(console.log)
        .catch(console.error); //コマンド一斉削除
})

let command_int = 0
for (const file of commandFiles) {
    command_int++; //数数える 

    const command = require(`./commands/${file}`); //同じ階層にあるcommandフォルダの中にあるjsファイルを取得
    console.log(`${file} がロードされました。`)

    client.commands.set(command.data.name, command);
}
console.log(`合計${command_int}個がロードされました。`)

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try { //例外が発生するかも
        await command.execute(interaction);
    } catch (error) {
        console.error(error); //したときの処理
        await interaction.reply({ content: "コマンド実行時にエラーが発生しました。", ephemeral: true});
    }
});

client.login(process.env.TOKEN);
