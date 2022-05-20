const http = require("http");
http.createServer(function (req, res) {
  res.write("online");
  res.end();
}).listen(8080);

const fs = require("fs");
const { Client, Intents, Interaction, Collection, Message, MessageEmbed, MessegeButton } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

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
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "コマンド実行時にエラーが発生しました。", ephemeral: true});
    }
});

client.login(process.env.TOKEN);