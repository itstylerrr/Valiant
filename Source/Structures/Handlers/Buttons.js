module.exports = async (client, PG, chalk) => {
    
    const buttonsFolder = await PG(`${(process.cwd().replace(/\\/g, "/"))}/Source/Buttons/**/*.js`);
    buttonsFolder.map(async (file) => {
        const buttonFile = require(file);
        if (!buttonFile.id) return;

        client.buttons.set(buttonFile.id, buttonFile);
    });
}