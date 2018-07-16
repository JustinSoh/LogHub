using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LogHubWebAPI.Models;

namespace LogHubWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Organizations")]
    public class OrganizationsController : Controller
    {
        private readonly Context _context;

        public OrganizationsController(Context context)
        {
            _context = context;
        }

        // GET: api/Organizations
        [HttpGet]
        public IEnumerable<Organization> GetOrganizations()
        {
            return _context.Organizations;
        }

        // GET: api/Organizations/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrganization([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var organization = await _context.Organizations.SingleOrDefaultAsync(m => m.OrganizationId == id);

            if (organization == null)
            {
                return NotFound();
            }

            return Ok(organization);
        }

        // PUT: api/Organizations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrganization([FromRoute] string id, [FromBody] Organization organization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != organization.OrganizationId)
            {
                return BadRequest();
            }

            _context.Entry(organization).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrganizationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Organizations
        [HttpPost]
        public async Task<IActionResult> PostOrganization([FromBody] Organization organization)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Organizations.Add(organization);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrganization", new { id = organization.OrganizationId }, organization);
        }

        // DELETE: api/Organizations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrganization([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var organization = await _context.Organizations.SingleOrDefaultAsync(m => m.OrganizationId == id);
            if (organization == null)
            {
                return NotFound();
            }

            _context.Organizations.Remove(organization);
            await _context.SaveChangesAsync();

            return Ok(organization);
        }

        private bool OrganizationExists(string id)
        {
            return _context.Organizations.Any(e => e.OrganizationId == id);
        }
    }
}