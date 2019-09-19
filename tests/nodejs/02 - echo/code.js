/**
 * Introducing 2 new functions
 * * readline - emulates sync user input in nodejs
 * * print - emulates console output
 */
let input = null
while ((s = readline())) {
  print(s)
}
