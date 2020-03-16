# How to contribute

Here are some important resources:

 * wiki: [Earthdata Pub Wiki](https://wiki.earthdata.nasa.gov/display/EDPUB)
 * bugs: [New Issue](https://bugs.earthdata.nasa.gov/secure/RapidBoard.jspa?rapidView=911&projectKey=EDPUB&view=planning.nodetail&issueLimit=100)
 * comms: [#earthdatapub EOSDIS Slack Channel](https://eosdis.slack.com/archives/CBPQF3Y5T)

## Coding standards

See Earthdata Pub [Standards and Style](https://wiki.earthdata.nasa.gov/display/EDPUB/Standards+and+Style) for specific coding standards.

General coding standards are:

1. document as you go
1. make your code readable
1. think about security from the start
1. use a standard style guide (such as [PEP 8](https://www.python.org/dev/peps/pep-0008/))
1. use a linter (such as [pylint](https://www.pylint.org/))
1. use .gitignore to exclude files that should not be in a repo (see this repo's [.gitignore](./.gitignore))

An IDE, such as [VS Code](https://code.visualstudio.com/), helps to create and maintain beautiful code.

## Testing

Create unit test for any code you write. _(TO DO: Insert details of how tests are run for development and deployment based on input from CI/CD team and Bamboo set up.)_

## Submitting changes

### Git flow

Earthdata Pub will follow the [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow). When possible, feature branches should be tied directly to a Jira ticket.

### Commit messages

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    >
    > A paragraph describing what changed and its impact."


### Pull Requests

Please make a new Pull Request with a clear list of what you've done (read more about [pull requests](https://www.atlassian.com/git/tutorials/making-a-pull-request)). Assign merge requests to someone else for a code review. Don't approve your own requests. Follow our coding standards (below). Make all of your commits atomic (one feature per commit).

### Change log

All features should be added to the [CHANGELOG.md](CHANGELOG.md). The changes can be also used for release notes.

From [https://keepachangelog.com/en/1.0.0/](https://keepachangelog.com/en/1.0.0/):

> What is a changelog?
>
> A changelog is a file which contains a curated, chronologically ordered list of notable changes for each version of a project.
>
> Why keep a changelog?
>
> To make it easier for users and contributors to see precisely what notable changes have been made between each release (or version) of the project.
>
> Who needs a changelog?
>
> People do. Whether consumers or developers, the end users of software are human beings who care about what's in the software. When the software changes, people want to know why and how.

### Version numbers

Version numbers for code will be used to identify changes to the code base. The format of that number should be `1.1.1` where the numbers mean `major.minor.fix`.

_(TO DO: Find a reference to follow and include it here.)_

## Bitbucket settings

All Bitbucket settings, e.g. Workflow and Pull Requests settings, should be set at the [EDPUB project settings](https://git.earthdata.nasa.gov/projects/EDPUB/settings) level. This is to ensure that all repositories under Earthdata Pub act the same. Developers will have an easier time working across repos if the behavior is consistent.
