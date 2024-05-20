const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");

describe("BStack demo test", () => {
  let driver;

  beforeAll(() => {
    driver = new Builder()
      .usingServer(`http://localhost:4444/wd/hub`)
      .withCapabilities(Capabilities.chrome())
      .build();
  });
  
  afterAll(async () => {
    await driver.quit();
  })
  
  test("search and filter products", async () => {
    await driver.get("https://www.flipkart.com");

    // Close the login popup if it appears
    try {
      await driver.wait(until.elementLocated(By.css('button._2KpZ6l._2doB4z')), 10000);
      await driver.findElement(By.css('button._2KpZ6l._2doB4z')).click();
    } catch (e) {
      console.log("No login popup appeared.");
    }

    // Search for "Samsung Galaxy S10"
    let searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('Samsung Galaxy S10', Key.RETURN);

    // Click on "Mobiles" in categories
    await driver.wait(until.elementLocated(By.xpath("/html/body/div/div/div[3]/div[1]/div[1]/div/div[1]/div/div/section/div[3]/div/a")), 10000);
    await driver.findElement(By.xpath("/html/body/div/div/div[3]/div[1]/div[1]/div/div[1]/div/div/section/div[3]/div/a")).click();

    // Apply Brand: Samsung filter
    await driver.wait(until.elementLocated(By.xpath("/html/body/div/div/div[3]/div[1]/div[1]/div/div[1]/div/section[3]/div[2]/div/div/div/label/div[2]")), 10000);
    await driver.findElement(By.xpath("/html/body/div/div/div[3]/div[1]/div[1]/div/div[1]/div/section[3]/div[2]/div/div/div/label/div[2]")).click();

    // Wait for the results to load
    await driver.sleep(5000);

    // Apply Flipkart Assured filter
    await driver.wait(until.elementLocated(By.xpath("/html/body/div/div/div[3]/div[1]/div[1]/div/div[1]/div/section[4]/label/div[2]/div")), 10000);
    await driver.findElement(By.xpath("/html/body/div/div/div[3]/div[1]/div[1]/div/div[1]/div/section[4]/label/div[2]/div")).click();

    // Sort by Price -> High to Low
    await driver.wait(until.elementLocated(By.xpath("//div[text()='Price -- High to Low']")), 10000);
    let priceHighToLowElement = await driver.findElement(By.xpath("//div[text()='Price -- High to Low']"));

    // Click on the element
    await priceHighToLowElement.click();

    // Wait for the results to load
    await driver.sleep(5000);

    // Read the set of results that show up on page 1
    let productElements = await driver.findElements(By.css('div.KzDlHZ'));
    let priceElements = await driver.findElements(By.css('div.Nx9bqj._4b5DiR'));
    let linkElements = await driver.findElements(By.css('a.CGtC98'));

    // Extract text and attributes from elements
    let productNames = await Promise.all(productElements.map(async element => await element.getText()));
    let displayPrices = await Promise.all(priceElements.map(async element => await element.getText()));
    let productLinks = await Promise.all(linkElements.map(async element => await element.getAttribute('href')));

    // Combine into one array of objects
    const results = productNames.map((name, index) => ({
      productName: name,
      displayPrice: displayPrices[index],
      productLink: productLinks[index]
    }));

    console.log(results);
  }, 300000);
});
