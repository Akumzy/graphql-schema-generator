#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import {generatorHandler} from '@prisma/generator-helper';

import generateGraphqlSchema from './generateGraphqlSchema';

export * from './converters/types';

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './generated',
      prettyName: 'GraphQL-Schema-Generator',
    };
  },
  async onGenerate(options) {
    const output = options.generator.output?.value;
    const {config} = options.generator;

    if (output) {
      if (config?.customRules) {
        const module = await import(
          path.join(output, '..', config?.customRules)
        );

        config.customRules = module.default.rules;
        config.argConfig = module.default.argConfig;
      }

      const result = await generateGraphqlSchema(options.datamodel, config);

      try {
        await fs.promises.mkdir(output, {
          recursive: true,
        });

        await fs.promises.writeFile(
          path.join(output, 'schema.graphql'),
          result,
        );
      } catch (e) {
        console.error(
          'Error: unable to write files for GraphQL-Schema-Generator',
        );
        throw e;
      }
    } else {
      throw new Error('No output was specified for GraphQL-Schema-Generator');
    }
  },
});
