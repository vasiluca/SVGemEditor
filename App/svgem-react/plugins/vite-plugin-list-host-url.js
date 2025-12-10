import colors from 'picocolors';
export const listHostURL =  {
	name: 'Output Link after First Run',
	configureServer(server) {
		const logUrl = () => {
			const urls = server.resolvedUrls;
			if (urls?.local[0]) {
				const localUrl = urls.local[0];
				server.config.logger.info(`\n ${colors.green('➜')} ${colors.bold(colors.cyan(localUrl))}`);
			}
		}
		// First run
		server.httpServer.once('listening', () => {
			server.config.logger.info(colors.gray('---'));
		});
		// Subsequent runs: after any file change (debounced)
		let timer;
		server.watcher.on('all', () => {
			clearTimeout(timer);
			timer = setTimeout(logUrl, 500);
		});
	}

}