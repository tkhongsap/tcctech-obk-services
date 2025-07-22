import yargs from 'yargs';
import fs from 'fs';
import path from 'path';

const templateDir = path.join(__dirname, '../src/templates/ob-template');

yargs
  .command(
    'create <project-name>',
    'Create a new project from the template',
    (yargs) => {
      yargs.positional('project-name', {
        describe: 'Name of the project',
      });
    },
    (argv) => {
      const projectName = argv['project-name'] as string;
      const targetDir = `${__dirname}/../../${projectName}`;

      console.log('Copying files from template directory:', templateDir);
      console.log('To target directory:', targetDir);

      copyAndUpdateDirectory(templateDir, targetDir, projectName);

      console.log('Template created successfully!');
    }
  )
  .help()
  .argv;

  function copyAndUpdateDirectory(source: string, target: string, projectName: string) {
  console.log('Copying and updating directory:', source);

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    console.log('Copying and updating file:', file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyAndUpdateDirectory(sourcePath, targetPath, projectName);
    } else {
      updateFile(sourcePath, targetPath, projectName);

      // Update the filename if it contains 'project-name'
      if (file.includes('project_name')) {
        const updatedFilename = file.replace('project_name', projectName).replace(/-/g, '_');
        const updatedTargetPath = path.join(target, updatedFilename);

        fs.renameSync(targetPath, updatedTargetPath);
      }
    }
  });
}

function updateFile(sourcePath: string, targetPath: string, projectName: string) {
  let fileContent = fs.readFileSync(sourcePath, 'utf-8');

  let projectUnderScore = projectName.replace('-', '_')

  // Update specific values based on the project name
  fileContent = fileContent.replace(/{{PROJECT-NAME}}/g, projectName);
  fileContent = fileContent.replace(/{{PROJECT_NAME}}/g, projectUnderScore);

  fs.writeFileSync(targetPath, fileContent);
}
