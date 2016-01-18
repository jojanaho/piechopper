describe "Pie Chopper [003]", ->
  beforeEach ->
    cy
      .visit("http://localhost:8080")
      .get(".btn").contains("Begin").as("beginBtn")
      .get("#model-selection-section").find(".btn").contains("Continue").as("continueFirstBtn")
      .get("#contrib-section").find(".btn").contains("Continue").as("continueSecBtn")

  describe "Scrolls Page [000]", ->
    # beforeEach ->
    #   cy
    #     .get("@beginBtn").click()
    #     .get("@continueFirstBtn").click()
    #     .get("@continueSecBtn").click()

    it "clicking on Begin scrolls to How to [002]", ->
      cy
        .get("h2").contains("How to chop it?").then ($el) ->
          expect($el.scrollTop()).to.eq 0
        .get("@beginBtn").click()
        .get("h2").contains("How to chop it?").then ($el) ->
          expect($el.scrollTop()).to.eq 0

  describe "Carousel Content [009]", ->
    beforeEach ->
      cy
        .get(".carousel-caption").as("carouselCaption")
        .get(".carousel-img").find("img").as("carouselImg")
        .get(".carousel-control.right").as("nextBtn")

    it "displays Company Roles by default [004]", ->
      cy
        .get("@carouselCaption").contains("Company Roles").should("be.visible")
        .get("@carouselImg").should("have.prop", "src").and("match", /roleBasedModel.png/)

    it.skip "next carousel is Market Value [005]", ->
      cy
        .get("@nextBtn").click()
        .get("@carouselCaption").contains("Market Value").should("be.visible")
        .get("@carouselImg").should("have.prop", "src").and("match", /marketValueModel.png/)

    it.skip "last carousel is Relative Importance [006]", ->
      cy
        .get("@nextBtn").click()
        .get("@nextBtn").click()
        .get("@carouselCaption").contains("Relative Importance").should("be.visible")
        .get("@carouselImg").should("have.prop", "src").and("match", /weightedAspectsModel.png/)

  describe "Contribution table [00a]", ->
    beforeEach ->
      cy
        # .get("#contrib-section").find("table").find("th").as("tableCols")

    context "Add Members [007]", ->
      it "adds new column on click of add member [008]", ->
        cy
          .get("#contrib-section").find("table").find("th").should("have.length", 3)
          .get(".member-add-btn").click()
          .get("#contrib-section").find("table").find("th").should("have.length", 4)

      it "hides button at max num of columns [00b]", ->
        cy
          .get("#contrib-section").find("table").find("th").should("have.length", 3)
          .get(".member-add-btn").click()
          .get(".member-add-btn").click()
          .get(".member-add-btn").click()
          .get(".member-add-btn").click()
          .get(".member-add-btn").should("be.hidden")

  describe "Tweak table [00a]", ->

  describe "Results [00c]", ->
    it "displays warning on post 404 [00d]", ->
      cy
        .get("#share-btn").click()
        .get(".modal").find("h2").contains("Ooops").should("be.visible")

    context "successfully shares [00e]", ->
      beforeEach ->
        cy
          .server()
          .route("POST", /proposals/, {"id": "569d3e8e3aa6b32c32d60de7"}).as("postProposals")
          .get("#share-btn").click()

      it "POSTs to proposals [00f]", ->
        cy.wait("@postProposals").its("url").should("match", /proposals/)

      it "appends response id to url [00g]", ->
        cy
          .wait("@postProposals").then (xhr) ->
            @id = xhr.responseJSON.id
          .get("#sharedUrl").should("have.prop", "value").and("match", new RegExp(@id))







