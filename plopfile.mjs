// Генератор для pnpm new:component; заготовки контента делает apps/website/scripts/new-entry.mjs.
export default function (plop) {
  plop.setHelper('pascal', (t) => plop.getHelper('properCase')(t));

  plop.setGenerator('component', {
    description: 'New Astro component in packages/ui',
    prompts: [{ type: 'input', name: 'name', message: 'Component name (PascalCase):' }],
    actions: [
      {
        type: 'add',
        path: 'packages/ui/src/components/{{pascalCase name}}/{{pascalCase name}}.astro',
        templateFile: 'plop-templates/component/component.astro.hbs',
      },
      {
        type: 'add',
        path: 'packages/ui/src/components/{{pascalCase name}}/{{pascalCase name}}.css.ts',
        templateFile: 'plop-templates/component/component.css.ts.hbs',
      },
      {
        type: 'add',
        path: 'apps/storybook/stories/{{pascalCase name}}.stories.ts',
        templateFile: 'plop-templates/component/component.stories.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/ui/src/components/{{pascalCase name}}/index.ts',
        templateFile: 'plop-templates/component/index.ts.hbs',
      },
    ],
  });
}
