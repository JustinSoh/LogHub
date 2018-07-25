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
    [Route("api/OverallBandwidths")]
    public class OverallBandwidthsController : Controller
    {
        private readonly Context _context;

        public OverallBandwidthsController(Context context)
        {
            _context = context;
        }

        // GET: api/OverallBandwidths
        [HttpGet]
        public IEnumerable<OverallBandwidth> GetOverallBandwidth()
        {
            return _context.OverallBandwidth;
        }

        // GET: api/OverallBandwidths/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOverallBandwidth([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var overallBandwidth = await _context.OverallBandwidth.SingleOrDefaultAsync(m => m.OverallBandwidthId == id);

            if (overallBandwidth == null)
            {
                return NotFound();
            }

            return Ok(overallBandwidth);
        }

        // PUT: api/OverallBandwidths/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOverallBandwidth([FromRoute] string id, [FromBody] OverallBandwidth overallBandwidth)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != overallBandwidth.OverallBandwidthId)
            {
                return BadRequest();
            }

            _context.Entry(overallBandwidth).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OverallBandwidthExists(id))
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

        // POST: api/OverallBandwidths
        [HttpPost]
        public async Task<IActionResult> PostOverallBandwidth([FromBody] OverallBandwidth overallBandwidth)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.OverallBandwidth.Add(overallBandwidth);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOverallBandwidth", new { id = overallBandwidth.OverallBandwidthId }, overallBandwidth);
        }

        // DELETE: api/OverallBandwidths/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOverallBandwidth([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var overallBandwidth = await _context.OverallBandwidth.SingleOrDefaultAsync(m => m.OverallBandwidthId == id);
            if (overallBandwidth == null)
            {
                return NotFound();
            }

            _context.OverallBandwidth.Remove(overallBandwidth);
            await _context.SaveChangesAsync();

            return Ok(overallBandwidth);
        }

        private bool OverallBandwidthExists(string id)
        {
            return _context.OverallBandwidth.Any(e => e.OverallBandwidthId == id);
        }
    }
}