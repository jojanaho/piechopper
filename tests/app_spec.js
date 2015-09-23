describe("PieChopper [000]", function(){
  beforeEach(function(){
    cy
      // starting the server prior to
      // a visit due to the way angular
      // holds a reference to the XHR object
      // this is a temporary fix.
      .server()
      .visit("http://localhost:8080")
  })

  it("has correct title [001]", function(){
    cy.title().should("eq", "PieChopper - Chop your startup equity")
  })

  it("has correct h1 [005]", function(){
    cy.get("h1").should("contain", "Chop your startup equity")
  })

  context("About [002]", function(){
    it("is collapsed by default [003]", function(){
      cy.get("#about-section").parents(".collapse").should("have.css", "height", "0px")
    })

    it("expands on click [004]", function(){
      cy
        .contains("About").click()
        .get("#about-section")
          .should("contain", "PieChopper assists startup teams to share their equity fair and square.")
          .parents(".collapse").should("have.css", "height", "66px")
    })
  })

  context("Begin button [006]", function(){
    it("scrolls to 'How to chop it? [008]", function(){
      // this is fairly difficult to test and not be coupled
      // to the screen size. so here we do a comparison on the windows
      // scrollY offset and compare that to the elements offset from the top.
      // when these two values match we know our window is scrolled to the element.
      cy
        .contains("button", "Begin").click()
        .window().then(function(win){
          // using a cy.then here to create a closure of the remote window

          // using cy.should as a function so 'win.scrollY' is re-evaluated on each retry.
          // if we used a regular .should("eq", win.scrollY) then the number would be hard
          // coded into the assertion and never change. by using a function its retry is
          // dynamically re-evaluated.
          cy.get("#model-selection-section").invoke("offset").its("top").should(function(top){
            expect(top).to.eq(win.scrollY)
          })
        })
    })
  })

  context("How to chop it? [00a]", function(){
    it("defaults with Company Roles [009]", function(){
      cy
        .get(".carousel-caption").contains("Company Roles").should("be.visible")
        .get(".model-selector-desc").should("contain", "The method is inspired by the Foundrs.com website.")
          .find("a").should("have.attr", "href", "http://foundrs.com/")
    })

    it("can change carousel to Market Value [00b]", function(){
      cy
        .get(".carousel-control.right").click()
        .get(".carousel-caption").contains("Market Value").should("be.visible")
        .get(".model-selector-desc").should("contain", "The method is inspired by the Slicing Pie website.")
          .find("a").should("have.attr", "href", "http://www.slicingpie.com/")
    })

    it("can change carousel to 'Relative Important' using cy.wait [00d]", function(){
      cy
        // its not great to have to use a .wait here because that couples us to a specific
        // wait time that may change in the future, or when our system is under load may
        // create flake. but this is a valid approach
        .get(".carousel-control.right").click().wait(1200).click()
        .get(".carousel-caption").contains("Relative Importance").should("be.visible")
        .get(".model-selector-desc").should("contain", "The method is inspired by the Founders Pie Calculator.")
          .find("a").should("have.attr", "href").and("include", "www.andrew.cmu.edu/user/fd0n/")
    })

    it("can change carousel to 'Relative Importance' using DOM selectors [00c]", function(){
      cy
        // another option is to wait until specific DOM-based attributes
        // are ready which gurantees us our animation is finished and we can
        // click the carousel again
        .get(".carousel-control.right").as("rightArrow").click()

        // when the 2nd slide has the class 'active' we know the animation is complete
        .get(".carousel-inner").children().eq(1).should("have.class", "active")

        // click the right arrow again
        .get("@rightArrow").click()

        // wait until the 3rd slide has the class 'active'
        .get(".carousel-inner").children().eq(2).should("have.class", "active")

        // do our normal assertions
        .get(".carousel-caption").contains("Relative Importance").should("be.visible")
        .get(".model-selector-desc").should("contain", "The method is inspired by the Founders Pie Calculator.")
          .find("a").should("have.attr", "href").and("include", "www.andrew.cmu.edu/user/fd0n/")
    })

    it("scrolls to How do you contribute? [00e]", function(){
      // an alternative approach to using cy.then and creating a closure
      // is by taking advantage of aliasing
      cy
        .window().as("win")
        .get("#model-selection-section").contains("button", "Continue").click()
        .get("#contrib-section").invoke("offset").its("top").should(function(top){
          // when we alias anything it becomes available inside of our
          // test's context, allowing us to reference it directly
          expect(top).to.eq(this.win.scrollY)
        })
    })
  })

  context("How do you contribute? [00i]", function(){
    beforeEach(function(){
      cy.get("#contrib-section").as("contrib")
    })

    // the form changes based on which algorithm
    // has been selected with 'Company Roles [00k]' being the default
    describe("Company Roles [00l]", function(){
      it("can add a Member C [00h]", function(){
        cy
          // do all of our work within this section
          .get("@contrib").within(function(){
            cy
              .get("thead th").should("have.length", 3)
              .get(".member-add-btn").click()
              .get("thead th").should("have.length", 4)
                .last().should("contain", "Member C")
          })
          // the member graph should now have 3 members
          .get("#slice-graph").find("[popover]").should("have.length", 3)
      })

      it("can remove a Member C [00m]", function(){
        cy
          .get("@contrib").within(function(){
            cy
              .get(".member-add-btn").click()
              .get("thead th").should("have.length", 4)
              .get("thead th").last().find(".member-remove-btn").click()
              .get("thead th").should("have.length", 3)
          })
          .get("#slice-graph").find("[popover]").should("have.length", 2)
      })

      it("calculates the values between members A + B [00n]", function(){
        // using contains here to select the <tr> with this content
        // so its much easier to understand which row we're focused on
        cy.contains("tr", "Who had the original idea for the project?")
          .find("td:eq(1) :checkbox").check()

        cy.contains("tr", "How much does the member participate into technical development?").within(function(){
          cy.get("td:eq(1) select").select("Some")
            .get("td:eq(2) select").select("Plenty")
        })

        cy.contains("tr", "Who would lead the technical team if you would get more personnel?").within(function(){
          // this should uncheck the 1st
          // after we check the 2nd
          cy.get("td:eq(1) :checkbox").check().as("chk1")
            .get("td:eq(2) :checkbox").check()
            .get("@chk1").should("not.be.checked")
        })

        cy.contains("tr", "How much does the member contribute to the business expenses").within(function(){
          cy.get("td:eq(1) select").select("Some")
            .get("td:eq(2) select").select("Little")
        })

        cy.contains("tr", "Who is or becomes the CEO?").within(function(){
          cy.get("td:eq(1) :checkbox").check()
        })

        cy
          .get("tfoot td:eq(1)").should("contain", "57.7 %")
          .get("tfoot td:eq(2)").should("contain", "42.3 %")
      })

      it("updates Member A + B values in #slice-graph [00o]", function(){
        cy.contains("tr", "How much does the member contribute to the product features?").within(function(){
          cy.get("td:eq(1) select").select("Little")
            .get("td:eq(2) select").select("Plenty")
        })

        // when we click the first slice a popover should appear with this content
        .get("#slice-graph").find("[popover]").as("slices").first().click()
        .get(".popover-content").should("contain", "Member A: 16.7%")

        // and we'll just check the [popover='...'] attr for the 2nd
        .get("@slices").last().should("have.attr", "popover", "Member B: 83.3%")
      })
    })

    describe("Market Value [00s]", function(){
      beforeEach(function(){
        // swap to market value
        cy.get(".carousel-control.right").click()
      })

      it("updates Member A + B's value [00r]", function(){
        cy.contains("tr", "How much cash is the member investing?").within(function(){
          // there is a bug in cy.type that forces us to
          // clear the input's value prior to typing
          // due to it receiving a selection range on click
          cy.get("td:eq(1) input").clear().type(50000)
          cy.get("td:eq(2) input").clear().type(25000)
        })

        cy.contains("tr", "How much does the member bring in other valuables ").within(function(){
          cy.get("td:eq(2) input").clear().type(10000)
        })

        cy
          .get("tfoot td:eq(1)").should("contain", "58.8 %")
          .get("tfoot td:eq(2)").should("contain", "41.2 %")
      })

      it("validates input and displays errors [00t]", function(){
        cy.contains("tr", "What is the sales commission percent that is usually paid on the market?").within(function(){
          cy.get("td:eq(1) input").clear().type(500)
            .parent().should("have.class", "invalid")
            .find(".cell-error-msg").should("contain", "Value must be smaller than 100")
        })
        .get("#results-section").should("contain", "Your input seems to contain errors.")
      })
    })
  })

  context("Sharing Results [00u]", function(){
    // simulate the server failing to respond to the share proposal
    it("displays error message in modal when server errors [00v]", function(){
      cy
        .route({
          method: "POST",
          url: /proposals/,
          status: 500,
          response: ""
        }).as("proposal")
        .get("#results-section").contains("Share").click()
        .wait("@proposal")
        .get(".modal").should("contain", "save the proposal.")
          .find("h2").should("contain", "Ooops !")

        // after we click on the backdrop the modal should go away
        .get(".modal-backdrop").click().should("not.exist")
    })

    it("sends up correct request JSON [00w]", function(){
      cy
        .route("POST", /proposals/, {}).as("proposal")
        .get("#results-section").contains("Share").click()
        .wait("@proposal").its("requestJSON").should(function(json){
          expect(json.userId).to.be.a("string")

          // expect there to be 3 keys in models
          expect(cy._.keys(json.repo.models)).to.have.length(3)

          // make sure the activeModelId matches on of our repo.models
          var selected = json.repo.models[json.repo.activeModelId]
          expect(selected).to.exist
          expect(selected.name).to.eq("Company Roles")
        })
    })

    it("displays share link on successful response [00x]", function(){
      var id = "12345-foo-bar"

      cy
        .route("POST", /proposals/, {id: id}).as("proposal")
        .get("#results-section").contains("Share").as("share").click()
        .wait("@proposal")

        // share button should now be disabled
        .get("@share").should("be.disabled")

        .get("#link-share-url").should("contain", "The following link can be copied and pasted over IM or email.")
        .get("#sharedUrl").invoke("val").should("include", "/#/p/" + id)
    })
  })

  context("responsive design [00y]", function(){
    beforeEach(function(){
      // change the viewport to iphone-6
      cy.viewport("iphone-6")
    })

    it("uses hamburger menu [00z]", function(){
      cy
        .get(".navbar").within(function(){
          cy
            .get(".btn-navbar").as("hamburger").should("be.visible").click()
            .get(".navbar-responsive-collapse").as("navbar").should("be.visible")
            .get("a.clickable").should("contain", "About")
            .get("@hamburger").click()
            .get("@navbar").should("have.css", "height").and("eq", "0px")
        })
    })
  })
})