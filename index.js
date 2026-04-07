const fs = require('node:fs/promises');
const path = require('node:path');
const baseDir = path.join(__dirname, 'baseFolder');

async function main() {
    try {
        await fs.mkdir(baseDir, { recursive: true });
        console.log(`--- Начало создания структуры в ${baseDir} ---\n`);

        for (let i = 1; i <= 5; i++) {
            const subDirName = `folder_${i}`;
            const subDirPath = path.join(baseDir, subDirName);
            await fs.mkdir(subDirPath, { recursive: true });

            for (let j = 1; j <= 5; j++) {
                const fileName = `file_${j}.txt`;
                const filePath = path.join(subDirPath, fileName);

               await fs.writeFile(filePath, `Это файл номер ${j} в папке ${i}`);
            }
        }

        await printStructure(baseDir);

    } catch (err) {
        console.error('Произошла ошибка:', err.message);
    }
}

async function printStructure(dirPath) {

    const items = await fs.readdir(dirPath);

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stats = await fs.stat(fullPath);
        const type = stats.isDirectory() ? '[ПАПКА]' : '[ФАЙЛ ]';
        console.log(`${type} ${fullPath}`);
        if (stats.isDirectory()) {
            await printStructure(fullPath);
        }
    }
}


void main();