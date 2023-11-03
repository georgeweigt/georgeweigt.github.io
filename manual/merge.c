// merge latex files

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
void emit(char *);
char buf[1000];

int
main(int argc, char *argv[])
{
	int i;

	system("cat preamble");

	for (i = 1; i < argc; i++)
		emit(argv[i]);

	fputs("\\end{document}\n", stdout);
}

void
emit(char *filename)
{
	FILE *f;

	fputs("\\newpage\n", stdout);

	f = fopen(filename, "r");

	if (f == NULL) {
		fprintf(stderr, "cannot open %s\n", filename);
		exit(1);
	}

	while (fgets(buf, sizeof buf, f))
		if (strcmp(buf, "\\begin{document}\n") == 0)
			break;

	while (fgets(buf, sizeof buf, f)) {
		if (strncmp(buf, "\\section*", 9) == 0) {
			fputs("\\section", stdout);
			fputs(buf + 9, stdout);
			continue;
		}
		if (strcmp(buf, "\\end{document}\n") == 0)
			break;
		fputs(buf, stdout);
	}

	fclose(f);
}
